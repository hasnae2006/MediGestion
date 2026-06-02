<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedecinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $medecin = $this->route('medecin');

        return [
            'nom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'prenom' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\'-]+$/u'],
            'specialite' => ['required', 'string', 'max:150', 'regex:/^[\pL\s\'-]+$/u'],
            'telephone' => ['required', 'string', 'regex:/^(\+212|0)[5-7][0-9]{8}$/'],
            'email' => ['required', 'email', 'max:255', Rule::unique('medecins', 'email')->ignore($medecin?->id)],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'nom.regex' => 'Le nom doit contenir seulement des lettres.',
            'prenom.required' => 'Le prenom est obligatoire.',
            'prenom.regex' => 'Le prenom doit contenir seulement des lettres.',
            'specialite.required' => 'La specialite est obligatoire.',
            'specialite.regex' => 'La specialite doit contenir seulement des lettres.',
            'telephone.required' => 'Le telephone est obligatoire.',
            'telephone.regex' => 'Le telephone doit etre marocain: 06/07/05... ou +212...',
            'email.required' => 'L email est obligatoire.',
            'email.email' => 'Veuillez saisir un email valide.',
            'email.unique' => 'Cet email est deja utilise.',
        ];
    }
}
