const form = document.getElementById('calc-form');
const result = document.getElementById('result');
const bmrValue = document.getElementById('bmr-value');
const tdeeValue = document.getElementById('tdee-value');
const goalValue = document.getElementById('goal-value');
const goalLabel = document.getElementById('goal-label');
const waterValue = document.getElementById('water-value');
const proteinValue = document.getElementById('protein-value');
const fatValue = document.getElementById('fat-value');
const carbsValue = document.getElementById('carbs-value');

const GOAL_ADJUSTMENT = {
  lose: { factor: -0.2, label: 'Норма калорий для похудения' },
  maintain: { factor: 0, label: 'Норма калорий для поддержания веса' },
  gain: { factor: 0.15, label: 'Норма калорий для набора массы' },
};

const ACTIVITY_WATER_BONUS_ML = {
  '1.2': 0,
  '1.375': 300,
  '1.55': 500,
  '1.725': 700,
  '1.9': 1000,
};

const MACRO_SPLIT = {
  lose: { protein: 0.35, fat: 0.3, carbs: 0.35 },
  maintain: { protein: 0.3, fat: 0.3, carbs: 0.4 },
  gain: { protein: 0.25, fat: 0.25, carbs: 0.5 },
};

function calculateBmr({ gender, age, weightKg, heightCm }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

function calculateWaterMl({ weightKg, activityFactor }) {
  const bonus = ACTIVITY_WATER_BONUS_ML[String(activityFactor)] ?? 0;
  return weightKg * 30 + bonus;
}

function calculateMacros({ calories, goal }) {
  const split = MACRO_SPLIT[goal];
  return {
    proteinG: Math.round((calories * split.protein) / 4),
    fatG: Math.round((calories * split.fat) / 9),
    carbsG: Math.round((calories * split.carbs) / 4),
  };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const gender = form.querySelector('input[name="gender"]:checked').value;
  const goal = form.querySelector('input[name="goal"]:checked').value;
  const age = Number(document.getElementById('age').value);
  const weightKg = Number(document.getElementById('weight').value);
  const heightCm = Number(document.getElementById('height').value);
  const activityFactor = Number(document.getElementById('activity').value);

  const bmr = calculateBmr({ gender, age, weightKg, heightCm });
  const tdee = bmr * activityFactor;
  const { factor, label } = GOAL_ADJUSTMENT[goal];
  const goalCalories = tdee * (1 + factor);
  const waterMl = calculateWaterMl({ weightKg, activityFactor });
  const { proteinG, fatG, carbsG } = calculateMacros({ calories: goalCalories, goal });

  bmrValue.textContent = `${Math.round(bmr)} ккал`;
  tdeeValue.textContent = `${Math.round(tdee)} ккал`;
  goalValue.textContent = `${Math.round(goalCalories)} ккал`;
  goalLabel.textContent = label;
  waterValue.textContent = `${(waterMl / 1000).toFixed(1)} л`;
  proteinValue.textContent = `${proteinG} г`;
  fatValue.textContent = `${fatG} г`;
  carbsValue.textContent = `${carbsG} г`;

  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
