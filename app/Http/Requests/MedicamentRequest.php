<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicamentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_commercial' => ['required', 'string', 'max:200', 'regex:/^[\pL\pN\s\'.()-]+$/u'],
            'forme' => ['required', 'in:comprime,sirop,injectable,capsule,autre'],
            'quantite_stock' => ['required', 'integer', 'min:0', 'max:100000'],
            // Dans MedicamentRequest.php — ajoutez dans rules() :
            'photo_boite' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'nom_commercial.required' => 'Le nom commercial est obligatoire.',
            'nom_commercial.regex' => 'Le nom du medicament contient des caracteres non autorises.',
            'forme.required' => 'La forme est obligatoire.',
            'forme.in' => 'La forme selectionnee est invalide.',
            'quantite_stock.required' => 'La quantite en stock est obligatoire.',
            'quantite_stock.integer' => 'La quantite en stock doit etre un nombre entier.',
            'quantite_stock.min' => 'La quantite en stock ne peut pas etre negative.',
            'quantite_stock.max' => 'La quantite en stock est trop elevee.',
        ];
    }
}
