// src/components/Recipe.jsx
import ReactMarkdown from 'react-markdown'

const Recipe = (props) => {
    return (
        <section className='suggested-recipe-container' aria-live="polite">
            <h2>Chef AI Recommends:</h2>
            
            <ReactMarkdown>
                {props.recipe}
            </ReactMarkdown>

            {/* Only show the button if the showSaveButton prop is true */}
            {props.showSaveButton && (
                <button className="save-btn" onClick={props.onSave}>
                    Save Recipe
                </button>
            )}
        </section>
    )
} 

export default Recipe