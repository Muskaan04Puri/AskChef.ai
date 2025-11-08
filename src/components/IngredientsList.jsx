const IngredientsList = ({ingredients, handleGetRecipe, ref}) => {

    const ingredientsListItems = ingredients.map(ingredient => (
         <li key={ingredient}>{ingredient}</li>
        )
    )

    return (
        <section>
          <h2>Ingredients on hand:</h2>
          <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
          {ingredients.length > 4 && <div className="get-recipe-container">
            <div ref={ref}>
              <h3>Ready for a recipe?</h3>
              <p>Generate a recipe from your list of ingredients.</p>
            </div>
            <button className="action-btn" onClick={handleGetRecipe}>Get a recipe</button>
          </div>}
        </section>
    )
}

export default IngredientsList