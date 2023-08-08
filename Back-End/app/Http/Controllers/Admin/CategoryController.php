<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;
    public function addCategory(CategoryRequest $categoryRequest)
    {
        $category = Category::create($categoryRequest->all());
        if ($category) {
            return $this->JsonResponse(201, 'Category Added', $category);
        } else {
            return $this->JsonResponse(500, 'Addition failed');
        }
    }
    public function allCategories()
    {
        $categories = Category::all();
        $data = [
            'count' => $categories->count(),
            'categories' => $categories
        ];
        if ($data['count'] != 0) {
            return $this->JsonResponse(200, 'All categories are here', $categories);
        } else {
            return $this->JsonResponse(500, 'No avialble categories', $data);
        }
    }
    public function updateStatus(Request $request, $id)
    {
        $category = Category::findorFail($id);
        $category->status = $request->input('status');
        $saved = $category->save();
        if ($saved) {
            return $this->JsonResponse(201, 'Status Updated', $category);
        } else {
            return $this->JsonResponse(500, 'Updating failed');
        }
    }
}