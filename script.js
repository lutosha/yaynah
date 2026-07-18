const form = document.getElementById('calc-form');
const result = document.getElementById('result');
const bmrValue = document.getElementById('bmr-value');
const tdeeValue = document.getElementById('tdee-value');
const goalValue = document.getElementById('goal-value');
const goalLabel = document.getElementById('goal-label');

const GOAL_ADJUSTMENT = {
  lose: { factor: -0.2, label: 'Норма калорий для похудения' },
  maintain: { factor: 0, label: 'Норма калорий для поддержания веса' },
  gain: { factor: 0.15, label: 'Норма калорий для набора массы' },
};

function calculateBmr({ gender, age, weightKg, heightCm }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
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

  bmrValue.textContent = `${Math.round(bmr)} ккал`;
  tdeeValue.textContent = `${Math.round(tdee)} ккал`;
  goalValue.textContent = `${Math.round(goalCalories)} ккал`;
  goalLabel.textContent = label;

  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
