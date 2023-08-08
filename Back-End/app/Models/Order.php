<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $casts = [
        'ordered_date' => 'datetime',
        'shipped_date' => 'datetime',
        'delivered_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(orderItem::class);
    }
}