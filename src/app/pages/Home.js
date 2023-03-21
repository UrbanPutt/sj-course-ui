import React from 'react'
import BasePage from "./BasePage/BasePage"

export default function Home(){
    const pageName = "HOME";

    return(
        <BasePage pageName = {pageName} pageContent={
            <div className="section w-screen justify-center">
                <h1><b>Welcome to the urban putt san jose control site!</b></h1>
                <p>This site is intended for urban putt personnel only.</p> 
                <p>Enjoy!</p>
            </div>
        }>
        </BasePage>
    )
}