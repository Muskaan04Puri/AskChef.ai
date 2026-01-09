import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../AuthContext";

const Sidebar = ({ onSelectRecipe, onNewRecipe, currentRecipeContent }) => {
  const [recipes, setRecipes] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "recipes"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc") 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipeData);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleDeleteRecipe = async (recipeId, event) => {
    event.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to delete this recipe? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      const recipeToDelete = recipes.find((r) => r.id === recipeId);
      if (recipeToDelete && recipeToDelete.content === currentRecipeContent) {
        onNewRecipe(); 
      }
      await deleteDoc(doc(db, "recipes", recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe.");
    }
  };

  return (
    <aside className="sidebar">
      <button onClick={onNewRecipe} className="new-recipe-btn">
        + New Recipe
      </button>

      <div className="recipe-list">
        <h3>Your History</h3>
        {recipes.length === 0 && (
          <p className="no-recipes">No saved recipes yet.</p>
        )}

        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} onClick={() => onSelectRecipe(recipe)} title={recipe.title}>
              <span className="recipe-title">{recipe.title}</span>
              <button
                className="delete-recipe-btn"
                onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                title="Delete Recipe"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
