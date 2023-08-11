<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ShowProduct extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imagePaths = explode('|', $this->image);
        $imageUrls = array_map(function ($imagePath) {
            return Storage::url($imagePath);
        }, $imagePaths);
        return [
            'product_id' => $this->id,
            'category_id' => $this->category->id,
            'product_name' => $this->title,
            'category_name' => $this->category->title,
            'description' => $this->description,
            'color' => $this->color,
            'discount' => $this->discount,
            'stock' => $this->stock,
            'image' => $imageUrls,
            'size' =>  $this->size,
            'price' =>  $this->price,
            'created_at'=>$this->created_at->toDateString()
        ];
    }
}