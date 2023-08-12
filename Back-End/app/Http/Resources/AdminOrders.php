<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminOrders extends JsonResource
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
            'user' => $this->user_data,
            'details' => json_decode($this->order_details),
            'price' => $this->total_price,
            'paid_method' => $this->paid,
            'promocode' => $this->promocode
        ];
    }
}
