<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddProductRequest;
use App\Http\Resources\ProductsResource;
use App\Http\Resources\ShowProduct;
use App\Models\Category;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ApiResponse;
    public function store(AddProductRequest $addProductRequest)
    {
        $product = new Product;
        $product->category_id = $addProductRequest->input('category_id');
        $product->title = $addProductRequest->input('title');
        $product->description = $addProductRequest->input('description');
        $product->color = $addProductRequest->input('color');
        $product->discount = $addProductRequest->input('discount');
        $product->stock = $addProductRequest->input('stock');
        $paths = [];
        if ($addProductRequest->hasFile('image1')) {
            $imageName = $addProductRequest->file('image');
            $path = $addProductRequest->file('image1')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image2')) {
            $path = $addProductRequest->file('image2')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image3')) {
            $path = $addProductRequest->file('image3')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image4')) {
            $path = $addProductRequest->file('image4')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image5')) {
            $path = $addProductRequest->file('image5')->store('public/products');
            $paths[] = $path;
        }
        $product->image = implode('|', $paths);
        $size = $addProductRequest->input('size');
        $product->size = $size;
        $price =  $addProductRequest->input('price');
        $product->price = $price;
        $stored = $product->save();
        if ($stored) {
            return $this->JsonResponse(201, 'Added success fully', $product);
        } else {
            return $this->JsonResponse(500, 'Error');
        }
    }
    public function getCategoriesWithProducts()
    {
        $categories = Category::with('products')->get();
        $category = ProductsResource::collection($categories);
        return $this->JsonResponse(200, 'Here are the products', $category);
    }
    public function showProductWithCategory($id)
    {
        $product = Product::find($id);
        $product = new ShowProduct($product);
        return $this->JsonResponse(200, 'The product is here', $product);
    }
    public function updateProduct(Request $addProductRequest)
    {
        $product = Product::find($addProductRequest->id);
        $images = explode('|', $product->image);
        foreach ($images as $image) {
            Storage::delete($image);
        }
        $product->title = $addProductRequest->input('title');
        $product->description = $addProductRequest->input('description');
        $product->color = $addProductRequest->input('color');
        $product->discount = $addProductRequest->input('discount');
        $product->stock = $addProductRequest->input('stock');
        $paths = [];
        if ($addProductRequest->hasFile('image1')) {
            $imageName = $addProductRequest->file('image');
            $path = $addProductRequest->file('image1')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image2')) {
            $path = $addProductRequest->file('image2')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image3')) {
            $path = $addProductRequest->file('image3')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image4')) {
            $path = $addProductRequest->file('image4')->store('public/products');
            $paths[] = $path;
        }
        if ($addProductRequest->hasFile('image5')) {
            $path = $addProductRequest->file('image5')->store('public/products');
            $paths[] = $path;
        }
        $product->image = implode('|', $paths);
        $size = $addProductRequest->input('size');
        $product->size = $size;
        $price =  $addProductRequest->input('price');
        $product->price = $price;
        $stored = $product->save();
        if ($stored) {
            return $this->JsonResponse(201, 'Added success fully', $product);
        } else {
            return $this->JsonResponse(500, 'Error');
        }
    }
    public function deleteProduct($id)
    {
        $product = Product::find($id);
        $images = explode('|', $product->image);
        foreach ($images as $image) {
            Storage::delete($image);
        }
        $deleted = Product::destroy($id);
        if ($deleted) {
            return $this->JsonResponse(200, 'Deleted success fully');
        } else {
            return $this->JsonResponse(500, 'Something went wrong', $deleted);
        }
    }
}
