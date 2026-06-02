<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReapprovisionnerMedicamentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantite' => ['required', 'integer', 'min:1', 'max:100000'],
        ];
    }

    public function messages(): array
    {
        return [
            'quantite.required' => 'La quantite a ajouter est obligatoire.',
            'quantite.integer' => 'La quantite doit etre un nombre entier.',
            'quantite.min' => 'La quantite doit etre au minimum 1.',
            'quantite.max' => 'La quantite est trop elevee.',
        ];
    }
}
