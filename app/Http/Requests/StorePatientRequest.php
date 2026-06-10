<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'prenom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'telephone' => ['required', 'string', 'min:6', 'max:20', 'regex:/^[0-9+\s().-]+$/'],
            'password' => ['required', 'confirmed', 'string', 'min:6'],
            'lien' => ['required', 'in:fils,fille,epoux,epouse,pere,mere,frere,soeur,infirmier,autre'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'date_naissance' => ['nullable', 'date', 'before:today'],
            'medecin_id' => ['nullable', 'exists:medecins,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'nom.regex' => 'Le nom doit contenir seulement des lettres.',
            'prenom.required' => 'Le prenom est obligatoire.',
            'prenom.regex' => 'Le prenom doit contenir seulement des lettres.',
            'email.required' => 'L email est obligatoire.',
            'email.email' => 'Veuillez saisir un email valide.',
            'email.unique' => 'Cet email est deja utilise.',
            'telephone.required' => 'Le telephone est obligatoire.',
            'telephone.regex' => 'Le telephone contient des caracteres invalides.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caracteres.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'lien.required' => 'Le lien est obligatoire.',
            'lien.in' => 'Le lien selectionne est invalide.',
            'adresse.max' => 'L adresse ne doit pas depasser 255 caracteres.',
            'date_naissance.before' => 'La date de naissance doit etre dans le passe.',
            'medecin_id.exists' => 'Le medecin selectionne est invalide.',
        ];
    }
}
