import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: none;
    font-weight: normal;
    letter-spacing: 1px;
    padding: 0.4rem 0.6rem;
    background-color: ${props => props.disabled ? colors.light_gray : props.color.background};
    font-size: 12px;
    color: ${props => props.fontColor ? props.fontColor : '#ffffff'};
    cursor: ${props => props.disabled ? 'default' : 'pointer'};

    :hover {
        background-color: ${ props => props.disabled ? colors.light_gray : props.color.hover };
        outline: ${ props => props.color.hover };
    }
`;

const ActionButton = (props) => {
    const {className, onClick, text, style} = props;
    const [colorScheme, setColorScheme] = useState({
        background: colors.blue,
        hover: colors.hover_blue,
        ready: false
    });

    useEffect(() =>{
        switch(props.type) {
            case 'reset':
                setColorScheme({
                    background: colors.red,
                    hover: colors.hover_red,
                    ready: true
                });
                break;
            default:
                setColorScheme({...colorScheme, ready: true});
                break;
        }
    }, []);

    return (
        <React.Fragment>
            {
                colorScheme.ready &&
                <StyledButton className={className} onClick={onClick} color={colorScheme} style={style} disabled={props.disabled} >
                    {text}
                </StyledButton>
            }
        </React.Fragment>
    );
}

export default ActionButton;