// src/components/Recipe.jsx
import ReactMarkdown from 'react-markdown'

const Recipe = (props) => {
    return (
        <section className='suggested-recipe-container' aria-live="polite">
            <h2>Chef AI Recommends:</h2>
            
            {/* The Markdown Content */}
            <ReactMarkdown>
                {props.recipe}
            </ReactMarkdown>

            {/* The New Save Button */}
            <button className="save-btn" onClick={props.onSave}>
                Save Recipe
            </button>
        </section>
    )
} 

export default Recipe