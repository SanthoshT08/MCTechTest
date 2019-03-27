$(document).ready(function () {
    GetProductList();
    GetDuplicateProductCount();
});

function GetProductList() {
    var tabProducts = $('#tbProduct');
    tabProducts.append('<tr><td colspan="4">Loading.......</tr>');
    $.ajax({
        type: 'GET',
        url: 'api/Product',
        dataType: 'JSON',
        success: function (data) {
            tabProducts.empty();
            $.each(data, function (index, val) {
                tabProducts.append('<tr>');
                tabProducts.append('<td>' + val.ProductName + '</td>');
                tabProducts.append('<td>' + val.ProductUrl + '</td>');
                tabProducts.append('<td>' + val.ProductCode + '</td>');
                tabProducts.append('<td><button type="button" class="btn btn-sm btn-outline-secondary" onClick="EditProduct(this);" data-id="'
                    + val.Id + '" data-name="' + val.ProductName + '" data-url="' + val.ProductUrl + '" data-code="'
                    + val.ProductCode + '">Edit</button> | ' +
                    '<button type="button" class="btn btn-sm btn-outline-danger" onClick="DeleteProduct(this);" data-id="'
                    + val.Id + '">Delete</button></td>');
            });
        }
    })
}

function EditProduct(product) {
    var id = $(product).data('id');
    var pName = $(product).data('name');
    var pUrl = $(product).data('url');
    var pCode = $(product).data('code');

    $('#hEditProdId').val(id);
    $('#tbEditProdName').val(pName);
    $('#tbEditProdUrl').val(pUrl);
    $('#tbEditProdCode').val(pCode);
    $('#lblMessage').text('');
    $('#editProductModal').modal();
}

function UpdateProduct() {
    var id = $('#hEditProdId').val();
    var pName = $('#tbEditProdName').val();
    var pUrl = $('#tbEditProdUrl').val();
    var pCode = $('#tbEditProdCode').val();
    var data = {
        ProductName: pName,
        ProductUrl: pUrl,
        ProductCode: pCode
    };

    $.ajax({
        type: 'PUT',
        url: 'api/Product/' + id,
        data: data,
        success: function () {
            $('#lblMessage').removeClass('text-danger');
            $('#lblMessage').addClass('text-info');
            $('#lblMessage').text('Updated Successfully.');
            GetProductList();
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
            console.log(xhr.responseText);
            $('#lblMessage').removeClass('text-info');
            $('#lblMessage').addClass('text-danger');
            $('#lblMessage').text(xhr.responseText);
        }
    });
}

function DeleteProduct(product) {
    if (confirm('Are you sure ?')) {
        var id = $(product).data('id');
        $.ajax({
            type: 'DELETE',
            url: 'api/Product/' + id,
            success: function () {
                alert('Successfully deleted.');
                GetProductList();
            }
        });
    }
}

function ValidateForm() {
    var isFormValid = true;
    var valMessage = $('#ulValMessages');
    valMessage.empty();
    if ($('#tbProdName').val() === '') {
        valMessage.append('<li>Product Name is required.</li>');
        isFormValid = false;
    }
    if ($('#tbProdUrl').val() === '') {
        valMessage.append('<li>Product URL is required.</li>');
        isFormValid = false;
    }
    if ($('#tbProdCode').val() === '') {
        valMessage.append('<li>Product Code is required.</li>');
        isFormValid = false;
    }
    return isFormValid;
}

function CreateProduct() {
    if (ValidateForm()) {
        var pName = $('#tbProdName').val();
        var pUrl = $('#tbProdUrl').val();
        var pCode = $('#tbProdCode').val();
        var data = {
            ProductName: pName,
            ProductUrl: pUrl,
            ProductCode: pCode
        };

        $.ajax({
            type: 'POST',
            url: 'api/Product',
            data: data,
            success: function () {
                $('#lblMessage').removeClass('text-danger');
                $('#lblMessage').addClass('text-info');
                $('#lblMessage').text('Created Successfully.');
                $('#tbProdName').val("");
                $('#tbProdUrl').val("");
                $('#tbProdCode').val("");
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
                console.log(xhr.responseText);
                $('#lblMessage').removeClass('text-info');
                $('#lblMessage').addClass('text-danger');
                $('#lblMessage').text(xhr.responseText);
            }
        });
    }
}

/* Duplicate Products */
function EditDupProduct(product) {
    var id = $(product).data('id');
    var pName = $(product).data('name');
    var pUrl = $(product).data('url');
    var pCode = $(product).data('code');

    $('#hEditProdId').val(id);
    $('#tbEditProdName').val(pName);
    $('#tbEditProdUrl').val(pUrl);
    $('#tbEditProdCode').val(pCode);
    $('#lblMessage').text('');
    $('#editDupProductModal').modal();
}

function GetDuplicateProductCount() {
    var tabProducts = $('#tbDupProductCount');
    tabProducts.append('<tr><td colspan="4">Loading.......</tr>');
    $.ajax({
        type: 'GET',
        url: 'api/Product/DuplicatesCount',
        dataType: 'JSON',
        success: function (data) {
            tabProducts.empty();
            $.each(data, function (index, val) {
                tabProducts.append('<tr>');
                tabProducts.append('<td><a href="#" onclick="GetDupProductList(this);" data-name="' + index + '">' + index + ' (' + val + ')</a></td>');
                tabProducts.append('</tr>');
            });
        }
    })
}

function GetDupProductList(product) {
    $('#sDupCount').hide();
    $('#sDupDetails').show();

    var id = $(product).data('id');
    $('#hEditProdId').val(id);
    var pName = $(product).data('name');
    var tabProducts = $('#tbDupProduct');
    var data = {
        prodName: pName
    };
    tabProducts.append('<tr><td colspan="4">Loading.......</tr>');
    $.ajax({
        type: 'GET',
        url: 'api/Product/Duplicates',
        data: data,
        success: function (data) {
            tabProducts.empty();
            $.each(data, function (index, val) {
                if (index === 0) {
                    tabProducts.append('<tr>');
                    tabProducts.append('<td><input type="text" id="tbDupProdName" class="form-control" value=' + val.ProductName + '></td>');
                    tabProducts.append('<td><input type="text" id="tbDupProdUrl" readonly="readyonly" class="form-control" value=' + val.ProductUrl + '></td>');
                    tabProducts.append('<td><input type="text" id="tbDupProdCode" readonly="readyonly" class="form-control" value=' + val.ProductCode + '></td>');
                    tabProducts.append('<td><button type="button" class="btn btn-sm btn-outline-secondary" onClick="EditDuplicateProduct(this);" data-id="'
                        + val.Id + '" data-name="' + val.ProductName + '" data-url="' + val.ProductUrl + '" data-code="'
                        + val.ProductCode + '">Update</button> | ' +
                        '<button type="button" class="btn btn-sm btn-outline-danger" onClick="DeleteProduct(this);" data-id="'
                        + val.Id + '">Delete</button></td>');
                    tabProducts.append('</tr>');
                }
                else {
                    tabProducts.append('<tr>');
                    tabProducts.append('<td>' + val.ProductName + '</td>');
                    tabProducts.append('<td>' + val.ProductUrl + '</td>');
                    tabProducts.append('<td>' + val.ProductCode + '</td>');
                    tabProducts.append('<td><button type="button" class="btn btn-sm btn-outline-secondary" onClick="EditDupProduct(this);" data-id="'
                        + val.Id + '" data-name="' + val.ProductName + '" data-url="' + val.ProductUrl + '" data-code="'
                        + val.ProductCode + '">Edit</button> | ' +
                        '<button type="button" class="btn btn-sm btn-outline-danger" onClick="DeleteProduct(this);" data-id="'
                        + val.Id + '">Delete</button></td>');
                    tabProducts.append('</tr>');
                }
                
            });
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
            console.log(xhr.responseText);
        }
    })
}

function EditDuplicateProduct(product) {
    var id = $(product).data('id');
    var pName = $('#tbDupProdName').val();
    var pUrl = $('#tbDupProdUrl').val();
    var pCode = $('#tbDupProdCode').val();
    var data = {
        ProductName: pName,
        ProductUrl: pUrl,
        ProductCode: pCode
    };
    $.ajax({
        type: 'PUT',
        url: 'api/Product/' + id,
        data: data,
        success: function () {
            alert('Updated Successfully.');
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
            console.log(xhr.responseText);
        }
    });
}