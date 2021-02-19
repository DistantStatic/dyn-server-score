import { Switch, Route } from 'react-router-dom';

import MainDisplay from './containers/maindisplay/MainDisplay';

const app = (props) => {
    return (    
        <Switch>
            {/**Need to find way of triggering renders without "key",
             *  Nested routes in MainDisplay?  */}
            <Route path={"/alpha"} render={() => (<MainDisplay key="a" />)} />
            <Route path={"/sierra"} render={() => (<MainDisplay key="s" />)} />
            <Route path={"/papa"} render={() => (<MainDisplay key="p" />)} />
            <Route path={"/"} exact render={() => (<MainDisplay key="s" />)} />
         </Switch>           
    )
}

export default app