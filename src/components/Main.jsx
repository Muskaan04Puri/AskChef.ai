import { useEffect, useRef, useState } from "react"
import Recipe from "./Recipe"
import IngredientsList from "./IngredientsList"
import { getRecipeFromMistral } from "../ai"

const Main = () => {

  const [ingredients, setIngredients] = useState([])
  const [recipe, setRecipe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true) 
    setRecipe(false)   
    
    try {
      const aiRecipe = await getRecipeFromMistral(ingredients)
      setRecipe(aiRecipe)
    } catch (err) {
      console.error(err)
      setRecipe("Sorry, an error occurred. Please try again.")
    } finally {
      setIsLoading(false) 
    }
  }

  return (
    <main>
        <form action={handleSubmit} className="ingredient-form">
            <input type="text" aria-label="Add ingredient" placeholder="e.g. oregano" name="ingredient" />
            <button>Add ingredient</button>
        </form>
        {ingredients.length > 0 && <IngredientsList ref={recipeSection} ingredients={ingredients} handleGetRecipe={handleGetRecipe} isLoading={isLoading} />}
        {recipe && <Recipe recipe={recipe}/>}
    </main>
  )
}

export default Main
