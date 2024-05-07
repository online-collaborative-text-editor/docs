import React from 'react';


const AnimatedH1 = ({ children }) => {
    // Split the header text into words
    const headerWords = children.split(' ');

    return (
        <h1 className="animated-header">
            {headerWords.map((word, wordIndex) => (
                <span key={wordIndex} className="word">
                    {word.split('').map((letter, letterIndex) => (
                        <span key={letterIndex} style={{ animationDelay: `${wordIndex * 0.5 + letterIndex * 0.1}s` }} className="letter-animation">{letter}</span>
                    ))}
                    {wordIndex !== headerWords.length - 1 && ' '} {/* Preserve spaces between words */}
                </span>
            ))}
        </h1>
    );
};

export default AnimatedH1;
