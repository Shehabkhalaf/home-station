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
        $product->color = implode('|', $addProductRequest->input('color'));
        $product->discount = $addProductRequest->input('discount');
        $product->stock = $addProductRequest->input('stock');
        $images = $addProductRequest->file('image');
        $imagePaths = [];
        foreach ($images as $image) {
            $imageData = file_get_contents($image->getRealPath());
            $base64Image = base64_encode($imageData);
            $imagePaths[] = $base64Image;
        }
        $product->image = implode('|', $imagePaths);
        /*$images = $addProductRequest->file('image');
        $paths = [];
        foreach ($images as $image) {
            $path = $image->store('public/products');
            $paths[] = $path;
        }
        $product->image = implode('|', $paths);*/
        $size = implode('|', $addProductRequest->input('size'));
        $product->size = $size;
        $price = implode('|', $addProductRequest->input('price'));
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
    public function updateProduct(Request $request)
    {
        $product = Product::find($request->input('id'));
        $photos = explode('|', $product->image);
        foreach ($photos as $photo) {
            Storage::delete($photo);
        }
        $product->title = $request->input('title');
        $product->description = $request->input('description');
        $product->color = $request->input('color');
        $product->discount = $request->input('discount');
        $product->stock = $request->input('stock');
        $images = $request->file('image');
        $pathes = [];
        foreach ($images as $image) {
            $path = $image->store('public/products/');
            $pathes[] = $path;
        }
        $product->image = implode('|', $pathes);
        $size = implode('|', $request->input('size'));
        $product->size = $size;
        $price = implode('|', $request->input('price'));
        $product->price = $price;
        $stored = $product->save();
        if ($stored) {
            return $this->JsonResponse(201, 'Added success fully', $product);
        } else {
            return $this->JsonResponse(500, 'Error');
        }
    }
    public function deleteProduct(Request $request)
    {
        $deleted = Product::destroy($request->id);
        if ($deleted) {
            return $this->JsonResponse(200, 'Deleted success fully');
        } else {
            return $this->JsonResponse(500, 'Something went wrong', $deleted);
        }
    }
}
