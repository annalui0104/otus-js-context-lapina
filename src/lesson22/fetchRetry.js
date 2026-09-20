
export async function fetchRetry(url, retries, delay) {
    if (!Number.isInteger(retries) || retries < 1) {
        throw new RangeError(
            "Количество попыток должно быть положительным целым числом",
        );
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status}`,
                );
            }

            return response;
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }

            await new Promise((resolve) => {
                setTimeout(resolve, delay);
            });
        }
    }
}