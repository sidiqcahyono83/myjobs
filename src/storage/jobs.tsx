import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

import { type Job } from "../data/jobs";

export async function getJobs(query?: string) {
	await fakeNetwork(`getJobs:${query}`);
	let jobs = (await localforage.getItem("jobs")) as Job[];
	if (!jobs) jobs = [];
	if (query) {
		jobs = matchSorter(jobs, query, { keys: ["title"] });
	}
	return jobs.sort(sortBy("last", "id"));
}

export async function createJob(formData: FormData) {
	await fakeNetwork(``);

	const newJob: Job = {
		id: Math.floor(Math.random() * (10_000_000 - 1 + 1) + 1),
		title: String(formData.get("title")),
		category: String(formData.get("category")),
		division: String(formData.get("division")),
		isDone: String(formData.get("isDone")),
		timeStart: new Date(),
		timeEnd: new Date(),
	};

	const jobs = await getJobs();
	const newJobs = [...jobs, newJob];
	await set(newJobs);
	return newJob;
}

export async function getJob(id: number) {
	await fakeNetwork(`job:${id}`);
	const jobs = (await localforage.getItem("jobs")) as Job[];
	const job = jobs.find((job) => job.id === id);
	return job ?? null;
}

export async function updateJob(id: number, updates: Job) {
	await fakeNetwork(``);
	const jobs = (await localforage.getItem("jobs")) as Job[];
	const job = jobs.find((job) => job.id === id);
	if (!job) throw new Error("No job found for");
	Object.assign(job, updates);
	await set(jobs);
	return job;
}

export async function deleteJob(id: number) {
	const jobs = (await localforage.getItem("jobs")) as Job[];
	const index = jobs.findIndex((job) => job.id === id);
	if (index > -1) {
		jobs.splice(index, 1);
		await set(jobs);
		return true;
	}
	return false;
}

function set(jobs: Job[]) {
	return localforage.setItem("jobs", jobs);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key: string) {
	if (!key) {
		fakeCache = {};
	}

	// @ts-expect-error Later
	if (fakeCache[key]) {
		return;
	}

	// @ts-expect-error Later
	fakeCache[key] = true;
	return new Promise((res) => {
		setTimeout(res, Math.random() * 800);
	});
}
