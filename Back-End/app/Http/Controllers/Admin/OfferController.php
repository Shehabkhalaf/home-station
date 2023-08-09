<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddOfferRequest;
use App\Models\Offer;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    use ApiResponse;
    public function addOffer(AddOfferRequest $request)
    {
        $offer = Offer::create($request->all());
        return $this->JsonResponse(201, 'Offer Created', $offer);
    }
    public function updateOffer(Request $request)
    {
        $offer = Offer::find($request->input('id'));
        $offer->promocode = $request->input('promocode');
        $offer->discount = $request->input('discount');
        $offer->started_at = $request->input('started_at');
        $offer->expired_at = $request->input('expired_at');
        $updated = $offer->save();
        if ($updated) {
            return $this->JsonResponse(201, 'Offer Updated', $offer);
        } else {
            return $this->JsonResponse(500, 'Cannot update it');
        }
    }
    public function allOffers()
    {
        $offers = Offer::all();
        return $this->JsonResponse(200, 'All offers are here', $offers);
    }
    public function showOffer($id)
    {
        $offer = Offer::find($id);
        return $this->JsonResponse(200, 'Your Offer is here', $offer);
    }
    public function deleteOffer($id)
    {
        $deleted = Offer::destroy($id);
        if ($deleted) {
            return $this->JsonResponse(200, 'Offer deleted successfully');
        } else {
            return $this->JsonResponse(500, 'Cannot delete it');
        }
    }
}