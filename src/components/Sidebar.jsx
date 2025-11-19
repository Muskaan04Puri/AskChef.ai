// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const Sidebar = ({ onSelectRecipe, onNewRecipe }) => {
    const [recipes, setRecipes] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        // Create the query: "Give me recipes for THIS user, newest first"
        const q = query(
            collection(db, "recipes"),
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc") // Needs an index (we'll fix this in a sec)
        );

        // 2. Listen for real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipeData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecipes(recipeData);
        });

        return unsubscribe;
    }, [currentUser]);

    return (
        <aside className="sidebar">
            <button onClick={onNewRecipe} className="new-recipe-btn">
                + New Recipe
            </button>

            <div className="recipe-list">
                <h3>Your History</h3>
                {recipes.length === 0 && <p className="no-recipes">No saved recipes yet.</p>}
                
                <ul>
                    {recipes.map(recipe => (
                        <li key={recipe.id} onClick={() => onSelectRecipe(recipe)}>
                            {recipe.title}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;