const IngredientsList = ({
  ingredients,
  handleGetRecipe,
  ref,
  isLoading,
  handleRemoveIngredient,
  recipeShown,
}) => {
  const ingredientsListItems = ingredients.map((ingredient) => (
    <li key={ingredient}>
      {ingredient}
      <button
        className="remove-btn"
        onClick={() => handleRemoveIngredient(ingredient)}
        aria-label={`Remove ${ingredient}`}
      >
        &ndash;
      </button>
    </li>
  ));

  return (
    <section>
      <h2>Ingredients on hand:</h2>
      <ul className="ingredients-list" aria-live="polite">
        {ingredientsListItems}
      </ul>
      {ingredients.length > 4 && !recipeShown && (
        <div className="get-recipe-container">
          <div ref={ref}>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <button className="action-btn" onClick={handleGetRecipe}>
              Get a recipe
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default IngredientsList;
