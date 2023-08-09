<?php

namespace App\Http\Requests;

use App\Traits\ApiResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class AddProductRequest extends FormRequest
{
    use ApiResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    public function failedValidation(Validator $validator)
    {
        if ($this->is('api/*')) {
            $response = $this->JsonResponse(422, 'Validation Errors', $validator->errors());
            throw new ValidationException($validator, $response);
        }
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => 'required',
            'title' => 'required|unique:products,title',
            'description' => 'required',
            //'image.*' => 'file|required|mimes:jpeg,png,jpg,gif|max:2048'
        ];
    }
    public function messages(): array
    {
        return [
            'category_id.required' => 'The category field is required.',
            'title.required' => 'The title field is required.',
            'description.required' => 'The description is required',
            'title.unique' => 'The title has already been taken.',
            /*'image.required' => 'An image is required.',
            'image.file' => 'The uploaded file must be an image.',
            'image.max' => 'The uploaded image must not exceed :max kilobytes.'*/
        ];
    }
}