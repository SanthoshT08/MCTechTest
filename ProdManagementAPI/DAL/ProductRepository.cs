using ProdManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ProdManagementAPI.Data
{
    public class ProductService
    {
        private readonly ProductManagementEntities _context;

        public ProductService()
        {
            _context = new ProductManagementEntities();
        }

        public async Task<bool> CreateProductAsync(Product product)
        {
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                string errorMessage = ex.Message + ex.StackTrace + ex.InnerException;
                return false;
            }
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var delProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (delProduct == null)
                return false;

            _context.Products.Remove(delProduct);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            return await _context.Products.OrderByDescending(p => p.Timestamp).ToListAsync();
        }

        public async Task<bool> ProductCodeExistsAsync(string productCode)
        {
            var pCode = await _context.Products.FirstOrDefaultAsync(pc => pc.ProductCode == productCode);
            if (pCode == null)
                return false;
            return true;
        }

        public async Task<bool> ProductCodeExistsAsync(int prodId, string productCode)
        {
            var pCode = await _context.Products.FirstOrDefaultAsync(pc => pc.ProductCode == productCode && pc.Id != prodId);
            if (pCode == null)
                return false;
            return true;
        }

        public async Task<bool> ProductUrlExistsAsync(string productUrl)
        {
            var pUrl = await _context.Products.FirstOrDefaultAsync(ur => ur.ProductUrl == productUrl);
            if (pUrl == null)
                return false;
            return true;
        }

        public async Task<bool> ProductUrlExistsAsync(int prodId, string productUrl)
        {
            var pUrl = await _context.Products.FirstOrDefaultAsync(ur => ur.ProductUrl == productUrl && ur.Id != prodId);
            if (pUrl == null)
                return false;
            return true;
        }

        public async Task<bool> UpdateProductAsync(int id, Product product)
        {
            var eProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (eProduct == null)
                return false;
            eProduct.ProductName = product.ProductName;
            eProduct.ProductUrl = product.ProductUrl;
            eProduct.ProductCode = product.ProductCode;
            try
            {
                _context.Entry(eProduct).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                string errorMessage = ex.Message + ex.StackTrace + ex.InnerException;
                return false;
            }
        }

        public async Task<List<Product>> GetDuplicateProductsAsync()
        {
            var duplicates = await _context.Products.GroupBy(x => x.ProductName)
                                           .Where(g => g.Count() > 1)
                                           .SelectMany(g => g)
                                           .OrderByDescending(p => p.ProductName)
                                           .ToListAsync();

            return duplicates;
        }

        public async Task<Dictionary<string, int>> GetDuplicatesCountByProduct()
        {
            Dictionary<string,int> dictDupCount = new Dictionary<string, int>();
            var dupProds = await _context.Products.GroupBy(x => new { x.ProductName })
                                            .Where(g => g.Count() > 1)
                                            .Select(g => new
                                            {
                                                ProductName = g.Key.ProductName,
                                                Count = g.Count()
                                            }).ToListAsync();

            foreach (var item in dupProds)
            {
                var pName = item.ProductName;
                var pCount = item.Count;
                dictDupCount.Add(pName, pCount);
            }
            return dictDupCount;
        }

        public async Task<List<Product>> GetProductsByProductName(string productName)
        {
            return await _context.Products.Where(p => p.ProductName == productName).OrderByDescending(p=>p.ProductName).ToListAsync();
        }
    }
}