import React, { useState, useRef } from 'react'

const IngredientNameInput = (props) => {
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedSuggestion, setSelectedSuggestion] = useState(0)
    const [suggestionList, setSuggestionList] = useState([])

    const nameInput = useRef(null)

    const onUserInput = (event) => {
        const input = event.target.value
        const filteredSuggestions = props.availableIngredients.filter(item => {
            return item.toLowerCase().includes(input.toLowerCase())
        })
        setSuggestionList(filteredSuggestions)
        setShowSuggestions(filteredSuggestions.length > 0)
        props.onChange({ name: input })
    }

    const onKeyDown = (event) => {
        const keyCode = event.keyCode
        if (showSuggestions) {
            if (keyCode == 38) { // UP
                const newSelectedSuggestion = Math.max(0, selectedSuggestion - 1)
                setSelectedSuggestion(newSelectedSuggestion)
                props.onChange({ name: suggestionList[newSelectedSuggestion] })
            } else if (keyCode == 40) { // DOWN
                const newSelectedSuggestion = Math.min(suggestionList.length - 1, selectedSuggestion + 1)
                setSelectedSuggestion(newSelectedSuggestion)
                props.onChange({ name: suggestionList[newSelectedSuggestion] })
            } else if (keyCode == 13) { // ENTER
                // props.onChange({ name: suggestionList[selectedSuggestion] })
                setShowSuggestions(false)
            } else if (keyCode == 9) { // TAB
                setShowSuggestions(false)
            }
        } else {
            if (keyCode == 13) { // ENTER 
                event.preventDefault()
            }
        }

    }

    const onMouseDown = (index) => () => {
        props.onChange({ name: suggestionList[index] })
        setShowSuggestions(false)
    }

    const onBlur = (event) => {
        setShowSuggestions(false)
    }

    const onFocus = () => {
        const filteredSuggestions = props.availableIngredients.filter(item => {
            return item.toLowerCase().includes(props.value.toLowerCase())
        })
        setSuggestionList(filteredSuggestions)
        setShowSuggestions(filteredSuggestions.length > 0)
    }

    const Suggestions = () => {
        if (!showSuggestions) return null

        return (
            <div style={styles.suggestions}>
                {
                    suggestionList.map((option, i) => {
                        const rowStyles = `${styles.suggestionRow} ${i == selectedSuggestion ? styles.selected : null}`
                        return (
                            <div key={i}
                                style={{...styles.suggestionRow, backgroundColor: i == selectedSuggestion ? 'lightgray' : 'white'}}
                                onMouseDown={onMouseDown(i)}>{option}</div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div style={styles.ingredientNameInput}>
            <input type="text"
                ref={nameInput}
                style={styles.input}
                value={props.value}
                onChange={onUserInput}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                onFocus={onFocus}
            />
            <Suggestions />

        </div>
    )

}
export default IngredientNameInput

const styles = {
    ingredientNameInput: {
        position: 'relative',
    },
    suggestions: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        backgroundColor: 'white',
        paddingTop: '3px',
        paddingBottom: '3px',
        borderRadius: '5px',
        border: '1px solid gray',
        cursor: 'pointer',
    },
    suggestionRow: {
        paddingLeft: '5px',
    },
}