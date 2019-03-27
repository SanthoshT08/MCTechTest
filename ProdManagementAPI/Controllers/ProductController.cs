using ProdManagementAPI.Data;
using ProdManagementAPI.Models;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;

namespace ProdManagementAPI.Controllers
{
    public class ProductController : ApiController
    {
        private readonly ProductService _service;
        public ProductController()
        {
            _service = new ProductService();
        }

        // GET: api/Product
        public async Task<List<Product>> Get()
        {
            return await _service.GetProductsAsync();
        }

        // GET: api/Product/5
        public async Task<Product> Get(int id)
        {
            return await _service.GetProductByIdAsync(id);
        }

        // POST: api/Product
        public async Task<IHttpActionResult> Post([FromBody] Product product)
        {
            if (await _service.ProductCodeExistsAsync(product.ProductCode))
                return BadRequest("Product Code already exists.");
            if (await _service.ProductUrlExistsAsync(product.ProductUrl))
                return BadRequest("Product Url already exists.");
            if (await _service.CreateProductAsync(product))
                return StatusCode(HttpStatusCode.Created);
            return BadRequest("Unable to create product, please try again later.");
        }

        // PUT: api/Product/5
        public async Task<IHttpActionResult> Put(int id, [FromBody] Product product)
        {
            if (await _service.ProductCodeExistsAsync(id, product.ProductCode))
                return BadRequest("Product Code already exists.");
            if (await _service.ProductUrlExistsAsync(id, product.ProductUrl))
                return BadRequest("Product Url already exists.");
            if (await _service.UpdateProductAsync(id, product))
                return StatusCode(HttpStatusCode.NoContent);
            return NotFound();
        }

        // DELETE: api/Product/5
        public async Task<IHttpActionResult> Delete(int id)
        {
            if (await _service.DeleteProductAsync(id))
                return StatusCode(HttpStatusCode.NoContent);
            return Unauthorized();
        }
        [HttpGet]
        [Route("api/Product/Duplicates")]
        public async Task<List<Product>> GetDuplicates(string prodName)
        {
            return await _service.GetProductsByProductName(prodName);
        }

        [HttpGet]
        [Route("api/Product/DuplicatesCount")]
        public async Task<Dictionary<string, int>> GetDuplicatesCount()
        {
            return await _service.GetDuplicatesCountByProduct();
        }
    }
}
