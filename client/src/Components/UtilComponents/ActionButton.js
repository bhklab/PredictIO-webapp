import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: none;
    font-weight: normal;
    letter-spacing: 1.5px;
    width: ${props => props.style.width ? props.style.width : '45%'};
    height: ${props => props.style.height ? props.style.height : '80px'};
    background-color: ${props => props.disabled ? colors.light_gray : props.color.background};
    font-size: ${props => props.style.fontSize ? props.style.fontSize : '20px'};
    color: ${props => props.style.fontColor ? props.style.fontColor : '#ffffff'};
    cursor: ${props => props.disabled ? 'default' : 'pointer'};

    :hover {
        background-color: ${ props => props.disabled ? colors.light_gray : props.color.hover };
        outline: ${ props => props.color.hover };
    }
`;

const ActionButton = (props) => {
    const {onClick, text, style} = props;
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
                <StyledButton onClick={onClick} color={colorScheme} style={style} disabled={props.disabled} >
                    {text}
                </StyledButton>
            }
        </React.Fragment>
    );
}

export default ActionButton;