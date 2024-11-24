export interface IDAO<T> {
    /**
     * Creates a new entity in the data store.
     * @param entity The entity to be created.
     * @returns A Promise that resolves to the created entity, typically with an assigned ID.
     */
    create(entity: Omit<T, 'id'>): Promise<T>;

    /**
     * Updates an existing entity in the data store.
     * @param id The unique identifier of the entity to update.
     * @param entity The updated entity data.
     * @returns A Promise that resolves to the updated entity.
     */
    update(id: string | number, entity: Partial<T>): Promise<T>;

    /**
     * Deletes an entity from the data store.
     * @param id The unique identifier of the entity to delete.
     * @returns A Promise that resolves to a boolean indicating whether the deletion was successful.
     */
    delete(id: string | number): Promise<boolean>;

    /**
     * Retrieves all entities from the data store.
     * @returns A Promise that resolves to an array of all entities.
     */
    getAll(): Promise<T[]>;

    /**
     * Retrieves a single entity by its unique identifier.
     * @param id The unique identifier of the entity to retrieve.
     * @returns A Promise that resolves to the found entity or null if not found.
     */
    getById(id: string | number): Promise<T | null>;
}