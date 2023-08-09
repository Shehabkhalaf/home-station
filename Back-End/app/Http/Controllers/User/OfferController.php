<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    use ApiResponse;
    public function allOffers()
    {
        $offers = Offer::all();
        if ($offers) {
            return $this->JsonResponse(200, "Here are the offers", $offers);
        } else {
            $this->JsonResponse(200, 'No Offers', $offers);
        }
    }
}
