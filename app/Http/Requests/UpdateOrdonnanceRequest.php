<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrdonnanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_medecin' => ['nullable', 'string', 'max:100', 'regex:/^[\pL\s\'.-]+$/u'],
            'date_prescription' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
            'active' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom_medecin.regex' => 'Le nom du medecin doit contenir seulement des lettres, espaces, points, tirets ou apostrophes.',
            'date_prescription.required' => 'La date de prescription est obligatoire.',
            'date_prescription.date_format' => 'La date doit respecter le format AAAA-MM-JJ.',
            'date_prescription.before_or_equal' => 'La date de prescription ne peut pas etre dans le futur.',
            'active.required' => 'Le statut est obligatoire.',
            'active.boolean' => 'Le statut est invalide.',
        ];
    }
}
