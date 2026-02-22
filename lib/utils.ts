export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function parseDateParam(dateParam: string | null): Date {
  const dateStr = dateParam ?? getTodayDate();
  return new Date(dateStr + "T00:00:00.000Z");
}

export function apiResponse(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function apiError(error: string, status = 400) {
  return Response.json({ success: false, error }, { status });
}
