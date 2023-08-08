<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserOrders extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'order_id' => $this->id,
            'order_details' => $this->order_details,
            'price' => $this->total_price,
            'status' => $this->status,
            'ordered_at' => $this->ordered_at,
        ];
    }
}
