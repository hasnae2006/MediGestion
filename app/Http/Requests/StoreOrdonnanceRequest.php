<?php

namespace App\Http\Requests;

use App\Models\Medicament;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrdonnanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', Rule::exists('patients', 'id')],
            'nom_medecin' => ['nullable', 'string', 'max:100', 'regex:/^[\pL\s\'.-]+$/u'],
            'date_prescription' => ['required', 'date', 'before_or_equal:today'],
            'dosages' => ['required', 'array', 'min:1'],
            'dosages.*.medicament_id' => ['nullable', 'integer', Rule::exists('medicaments', 'id')],
            'dosages.*.medicament_nom' => ['required_without:dosages.*.medicament_id', 'nullable', 'string', 'max:200', 'regex:/^[\pL\pN\s\'.()-]+$/u'],
            'dosages.*.duree' => ['required', 'integer', 'min:1', 'max:365'],
            'dosages.*.duree_unite' => ['required', 'in:jours,semaines,mois'],
            'dosages.*.quantite' => ['required', 'string', 'max:50', 'regex:/^[0-9]+([,.][0-9]+)?$/'],
            'dosages.*.quantite_unite' => ['required', 'string', 'max:30', 'regex:/^[\pL\pN\/%.-]+$/u'],
            'dosages.*.temps_ids' => ['required', 'array', 'min:1'],
            'dosages.*.temps_ids.*' => ['integer', Rule::exists('temps', 'id')],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'Veuillez selectionner un patient.',
            'patient_id.exists' => 'Le patient selectionne est invalide.',
            'nom_medecin.regex' => 'Le nom du medecin doit contenir seulement des lettres, espaces, points, tirets ou apostrophes.',
            'date_prescription.required' => 'La date de prescription est obligatoire.',
            'date_prescription.before_or_equal' => 'La date de prescription ne peut pas etre dans le futur.',
            'dosages.required' => 'Ajoutez au moins un dosage.',
            'dosages.*.medicament_id.exists' => 'Le medicament selectionne est invalide.',
            'dosages.*.medicament_nom.required_without' => 'Le medicament est obligatoire.',
            'dosages.*.medicament_nom.regex' => 'Le nom du medicament contient des caracteres non autorises.',
            'dosages.*.duree.required' => 'La duree est obligatoire.',
            'dosages.*.duree.min' => 'La duree doit etre au minimum 1.',
            'dosages.*.duree.max' => 'La duree ne doit pas depasser 365.',
            'dosages.*.quantite.required' => 'La quantite est obligatoire.',
            'dosages.*.quantite.regex' => 'La quantite doit etre un nombre.',
            'dosages.*.quantite_unite.required' => 'L unite est obligatoire.',
            'dosages.*.quantite_unite.regex' => 'L unite contient des caracteres non autorises.',
            'dosages.*.temps_ids.required' => 'Choisissez au moins un moment de prise.',
            'dosages.*.temps_ids.min' => 'Choisissez au moins un moment de prise.',
            'dosages.*.temps_ids.*.exists' => 'Un moment de prise selectionne est invalide.',
        ];
    }

    public function normalizedDosages(): array
    {
        return collect($this->validated('dosages'))
            ->map(function (array $dosage) {
                if (empty($dosage['medicament_id'])) {
                    $medicament = Medicament::firstOrCreate(
                        ['nom_commercial' => trim($dosage['medicament_nom'])],
                        ['forme' => 'autre', 'quantite_stock' => 0]
                    ); $dosage['medicament_id'] = $medicament->id;
                }return $dosage;})->all();
    }
}
