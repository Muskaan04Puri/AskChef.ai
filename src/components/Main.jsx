import { useEffect, useRef, useState } from "react"
import Recipe from "./Recipe"
import IngredientsList from "./IngredientsList"
import { getRecipeFromMistral } from "../ai"

const Main = () => {

  const [ingredients, setIngredients] = useState([])
  const [recipe, setRecipe] = useState(false)
  const recipeSection = useRef(null)

  useEffect(() => {
    if(recipe && recipeSection.current) {
      recipeSection.current.scrollIntoView({behavior: "smooth"})
    }
  }, [recipe])
  

  const handleSubmit = (formData) => {
    const newIngredient = formData.get("ingredient")
    setIngredients(prevIngredients => [...prevIngredients, newIngredient])
  }

  const handleGetRecipe = async () => {
    const aiRecipe = await getRecipeFromMistral(ingredients)
    setRecipe(aiRecipe)
  }

  return (
    <main>
        <form action={handleSubmit} className="ingredient-form">
            <input type="text" aria-label="Add ingredient" placeholder="e.g. oregano" name="ingredient" />
            <button>Add ingredient</button>
        </form>
        {ingredients.length > 0 && <IngredientsList ref={recipeSection} ingredients={ingredients} handleGetRecipe={handleGetRecipe} />}
        {recipe && <Recipe recipe={recipe}/>}
    </main>
  )
}

export default Main
