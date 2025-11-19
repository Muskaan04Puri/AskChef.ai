// src/components/Main.jsx
import { useEffect, useRef, useState } from "react";
import Recipe from "./Recipe";
import IngredientsList from "./IngredientsList";
import Sidebar from "./Sidebar"; // <-- 1. Import Sidebar
import { getRecipeFromMistral } from "../ai";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Main = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const recipeSection = useRef(null);

  useEffect(() => {
    if (recipe && recipeSection.current) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient");
    if (newIngredient) {
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    }
    event.target.reset();
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const handleGetRecipe = async () => {
    setIsLoading(true);
    setRecipe(false);
    try {
      const aiRecipe = await getRecipeFromMistral(ingredients);
      setRecipe(aiRecipe);
    } catch (err) {
      console.error(err);
      setRecipe("Sorry, an error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!currentUser) {
      alert("You must be logged in to save a recipe.");
      return;
    }
    try {
      const title =
        recipe.split("\n")[0].replace(/[#*]/g, "").trim() || "Untitled Recipe";
      await addDoc(collection(db, "recipes"), {
        userId: currentUser.uid,
        title: title,
        content: recipe,
        ingredients: ingredients,
        createdAt: serverTimestamp(),
      });
      alert("Recipe saved successfully!");
    } catch (err) {
      console.error("Error saving recipe:", err);
      alert("Failed to save recipe.");
    }
  };

  // FUNCTIONS FOR SIDEBAR ---

  // When clicking a history item
  const selectRecipe = (savedRecipe) => {
    setRecipe(savedRecipe.content); // Show the recipe
    setIngredients(savedRecipe.ingredients || []); // Optionally restore ingredients
  };

  // When clicking "+ New Recipe"
  const startNewRecipe = () => {
    setRecipe(false); // Clear recipe to show form
    setIngredients([]); // Clear ingredients list
  };

  return (
    <div className="main-container">
      <Sidebar onSelectRecipe={selectRecipe} onNewRecipe={startNewRecipe} />

      <main className="content-area">
        <form onSubmit={handleSubmit} className="ingredient-form">
          <input
            type="text"
            aria-label="Add ingredient"
            placeholder="e.g. oregano"
            name="ingredient"
          />
          <button>Add ingredient</button>
        </form>

        {ingredients.length > 0 && (
          <IngredientsList
            ref={recipeSection}
            ingredients={ingredients}
            handleGetRecipe={handleGetRecipe}
            isLoading={isLoading}
            handleRemoveIngredient={handleRemoveIngredient}
            recipeShown={recipe}
          />
        )}

        {recipe && <Recipe recipe={recipe} onSave={saveRecipe} />}
      </main>
    </div>
  );
};

export default Main;
