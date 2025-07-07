import styled from "styled-components";



export const MangaContainer = styled.Pressable`
    
    background-color: rgba(128, 128, 128, 0.2);;
    
    height: 300px;    
    width: 45%;
    margin: 10px;
    border-width: 1px;
    border-color: gray;

`

export const MangaTitle = styled.Text`
    
    
    font-size: 16px;
    
    color: white;
    font-weight: 600;
    padding: 5px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
    elevation:50;


`




export const MangaContainerText = styled.View`
    
    background-color: rgba(0, 0, 0, 0.2);
    width:100%;
    position: absolute;
    z-index:2;
    bottom: 0;
    top:0;
    height:100%;
    justify-content: flex-end;
    


`