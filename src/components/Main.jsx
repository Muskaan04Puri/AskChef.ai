import { useEffect, useRef, useState } from "react";
import Recipe from "./Recipe";
import IngredientsList from "./IngredientsList";
import Sidebar from "./Sidebar";
import { getRecipeFromMistral } from "../ai";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Main = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(false);
  // 1. NEW STATE: Track if we are viewing a recipe from history
  const [isViewingSaved, setIsViewingSaved] = useState(false);
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
      setIsViewingSaved(false);
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
      setIsViewingSaved(true);
    } catch (err) {
      console.error("Error saving recipe:", err);
      alert("Failed to save recipe.");
    }
  };

  const selectRecipe = (savedRecipe) => {
    setRecipe(savedRecipe.content);
    setIngredients(savedRecipe.ingredients || []);
    setIsViewingSaved(true);
  };

  const startNewRecipe = () => {
    setRecipe(false);
    setIngredients([]);
    setIsViewingSaved(false);
  };

  return (
    <div className="main-container">
      <Sidebar onSelectRecipe={selectRecipe} onNewRecipe={startNewRecipe} currentRecipeContent={recipe} />
      <main className="scroll-wrapper">
        <div className="content-center-container">
          <form onSubmit={handleSubmit} className="ingredient-form">
            <input
              type="text"
              aria-label="Add ingredient"
              disabled={isViewingSaved}
              placeholder={
                isViewingSaved
                  ? "Start a new recipe to add items"
                  : "e.g. oregano"
              }
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
              isViewingSaved={isViewingSaved}
            />
          )}

          {recipe && (
            <Recipe
              recipe={recipe}
              onSave={saveRecipe}
              showSaveButton={!isViewingSaved}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Main;
