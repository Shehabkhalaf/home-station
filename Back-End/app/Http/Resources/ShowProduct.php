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
            'color' => json_decode($this->color, true),
            'discount' => $this->discount,
            'stock' => $this->stock,
            'image' => $imageUrls,
            'size' =>  json_decode($this->size,true),
            'price' =>  json_decode($this->price,true) 
        ];
    }
}