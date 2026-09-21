"use client";

import { ScaleLoader } from "react-spinners";

const Loader = () => {
	return (
		<div className="flex flex-col justify-center items-center h-[70vh]">
			<ScaleLoader
				color="#db87db"
				height={40}
				speedMultiplier={1}
				width={10}
			/>
		</div>
	);
};

export default Loader;

