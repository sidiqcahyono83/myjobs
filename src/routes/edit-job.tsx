import {
	useLoaderData,
	LoaderFunctionArgs,
	redirect,
	Form,
	Link,
} from "react-router-dom";

import { getJob, updateJob } from "../storage/jobs";
import { Button, Label, Radio, TextInput } from "flowbite-react";
import { getTimeString } from "../datetime/date";

export async function loader({ params }: LoaderFunctionArgs) {
	const idParam = Number(params.jobId);
	const job = await getJob(idParam);
	console.log({ job });
	return { job };
}

export async function action({ request, params }: LoaderFunctionArgs) {
	const jobId = Number(params.jobId);
	const formData = await request.formData();
	const newJobData = {
		id: Number(formData.get("id")),
		title: String(formData.get("title")),
		category: String(formData.get("category")),
		division: String(formData.get("division")),
		isDone: Boolean(formData.get("isDone")),
		timeStart: new Date(),
		timeEnd: new Date(),
	};
	Object.fromEntries(formData);

	await updateJob(jobId, newJobData);

	return redirect(`/jobs/`);
}

export function EditJobRoute() {
	const { job } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

	if (!job) {
		return <p>Job not found.</p>;
	}

	return (
		<div className="w-4/5 mx-auto items-center">
			<h1 className="text-4xl font-bold mb-4 text-center">{job.title}</h1>
			<div className="flex justify-center">
				<Form
					method="post"
					className="flex flex-col max-w-lg content-center gap-4"
				>
					<TextInput
						type="hiden"
						name="id"
						defaultValue={job.id}
						hidden={true}
					/>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="title" value="Job Title" />
						</div>
						<TextInput
							id="title"
							type="text"
							name="title"
							placeholder="name@flowbite.com"
							defaultValue={job.title}
							required
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="Category" value="Job Category" />
						</div>
						<TextInput
							id="Category"
							type="text"
							name="category"
							defaultValue={job.category}
							required
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="division" value="Job Division" />
						</div>
						<TextInput
							id="division"
							type="text"
							name="division"
							defaultValue={job.division}
							required
						/>
					</div>
					<div className="flex gap-2">
						<div className="mb-2 block">
							<Label htmlFor="timeStart" value="Job Time Start" />
						</div>
						<TextInput
							id="timeStart"
							type="date"
							name="timeStart"
							defaultValue={getTimeString(job.timeStart) || ""}
							required
						/>
						<div className="mb-2 gap-2 col-span-2">
							<Label htmlFor="timeEnd" value="Job Time Start" />
						</div>
						<TextInput
							id="timeEnd"
							type="date"
							name="timeEnd"
							defaultValue={getTimeString(job.timeEnd) || ""}
							required
						/>
					</div>
					<fieldset className="flex max-w-md justify-center gap-4">
						<legend className="mb-4">
							Choose your progres job
						</legend>
						<div className="flex items-center gap-2">
							<Radio id="isDone" name="isDone" typeof="false" />
							<Label htmlFor="isDone">In progres</Label>
						</div>
						<div className="flex items-center gap-2">
							<Radio id="isDone2" name="isDone2" typeof="true" />
							<Label htmlFor="isDone2">Done</Label>
						</div>
					</fieldset>

					<div className="flex flex-col-2 gap-2 justify-between">
						<Button type="submit">Edit</Button>
						<Button color="warning" as={Link} to="/jobs">
							Back
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
}
