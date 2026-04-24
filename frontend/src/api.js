const BASE_URL = "http://localhost:8081";

export async function saveCourse({ courseCode, courseName, courseDescription }) {
    const res = await fetch(`${BASE_URL}/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode, courseName, courseDescription }),
    });
    if (!res.ok) throw new Error("Course API failed");
}

export async function saveCOs({ courseCode, cos }) {
    const res = await fetch(`${BASE_URL}/add-cos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseCode, cos }),
    });
    if (!res.ok) throw new Error("CO API failed");
}

export async function fetchCourseByCode(courseCode) {
    const res = await fetch(`${BASE_URL}/course?courseCode=${courseCode}`);
    if (!res.ok) throw new Error("Fetch error. Check backend.");
    const data = await res.json();
    return { ...data, courseOutcomesList: data.courseOutcomesList || [] };
}