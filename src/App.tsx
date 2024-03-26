import './init';
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TopNav } from './view/shell/desktop/TopNav';
import { Login } from './screens/Login';

function App() {
	return (
		<Router>
			<TopNav />
			<Routes>
				<Route path="/login" element={<Login onPressBack={() => {}} />} />
			</Routes>
		</Router>
	);
}

export default App;
