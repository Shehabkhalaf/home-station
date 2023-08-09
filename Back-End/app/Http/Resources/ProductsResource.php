<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

use function PHPSTORM_META\map;

class ProductsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'category_name' => $this->title,
            'category_id' => $this->id,
            'status' => $this->status,
            'products' => $this->products->map(function ($product) {
                $imagePaths = explode('|', $product->image);
                $imageUrls = array_map(function ($imagePath) {
                    return Storage::url($imagePath);
                }, $imagePaths);
                return [
                    'product_id' => $product->id,
                    'product_name' => $product->title,
                    'description' => $product->description,
                    'color' => explode('|', $product->color),
                    'discount' => $product->discount,
                    'stock' => $product->stock,
                    'images' => $imageUrls,
                    'price' => explode('|', $product->price),
                    'size' => explode('|', $product->size),
                ];
            }),
        ];
    }
}
