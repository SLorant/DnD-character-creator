const openDB = () => {
	const dbName = 'DnDCharacterDB';
	const dbVersion = 1;

	const request: IDBOpenDBRequest = indexedDB.open(dbName, dbVersion);
	let db: IDBDatabase | null;

	request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
		db = (event.target as IDBOpenDBRequest).result;

		if (!db.objectStoreNames.contains('characters')) {
			db.createObjectStore('characters', { keyPath: 'username' });
		}
	};
};

async function loadCharacterData(username: string, db: IDBDatabase | null) {
	if (db) {
		const transaction = db.transaction(['characters'], 'readonly');
		const store = transaction.objectStore('characters');

		const request = store.get(username);

		request.onsuccess = function () {
			const character = request.result;
			if (character) {
				// Use character data as needed
			}
		};

		request.onerror = function (e) {
			console.error('Error loading character data from IndexedDB', e);
		};
	}
}

export { openDB, loadCharacterData };
