import ReactMarkdown from 'react-markdown'

const Recipe = ({recipe}) => {
    return (
        <section className='suggested-recipe-container' aria-live="polite">
            <h2>Chef AI Recommends:</h2>
            <ReactMarkdown>
                {recipe}
            </ReactMarkdown>
        </section>
    )
} 

export default Recipe;