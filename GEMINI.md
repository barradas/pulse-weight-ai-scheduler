# Project: PulseWeight AI Scheduler
**Objective:** A web application that generates a personalized workout calendar (Running/Cycling) to bridge the gap between current weight and a target weight by a specific deadline.

---

## 1. Core Logic & Math
The application must use the following logic to generate the schedule:
- **Caloric Deficit Goal:** Total Weight Loss (kg) × 7,700 kcal (or 3,500 kcal per lb).
- **Daily Budget:** (Total Deficit / Days remaining) + Basal Metabolic Rate (BMR).
- **Activity Mapping:** 
    - **Running:** ~1.0 kcal per kg per km.
    - **Cycling:** ~0.4 kcal per kg per km (varies by intensity).
- **Milestones:** Generate "Check-in" dates at 25%, 50%, and 75% of the timeline.

## 2. Tech Stack
- **Frontend:** Next.js (App Router).
- **Styling:** Tailwind CSS v4.
- **State Management:** Zustand.
- **Date Handling:** date-fns.
- **Icons:** Lucide-React.

## 3. Implementation Phases

### Phase 1: Input & Calculation Engine
- Create a form for: `currentWeight`, `targetWeight`, `targetDate`, `age`, `gender`, and `height`.
- Implement a function `calculateRequiredBurn()` that outputs the total calories needed to be burned through exercise, assuming a neutral diet.

### Phase 2: Workout Generator Algorithm
- Distribute the total "Exercise Debt" across the calendar.
- Logic should allow the user to toggle between "High Intensity/Short Duration" and "Low Intensity/Long Duration."
- Randomize/Alternate between 'Running' and 'Cycling' days.

### Phase 3: Calendar UI
- Build a monthly/weekly grid view.
- Each cell should display: 
    - Workout Type (Icon).
    - Duration (Minutes).
    - Estimated Burn.
- Highlight Milestone days with a specific color.

### Phase 4: Export & Persistence
- Allow users to export the schedule as a JSON.
- LocalStorage integration to save the user's plan.
