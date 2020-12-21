import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    constructor (connection: Connection){
        connection.subscribers.push(this);
    }

    listenTo (){
        return UserEntity;
    }

    beforeInsert (event: InsertEvent<UserEntity>){
        console.log('BEFORE USER INSERTED: ', event.entity);
    }

    beforeUpdate (event: UpdateEvent<UserEntity>) {
        console.log('BEFORE ENTITY UPDATED: ', event.entity);
    }
    
    beforeRemove (event: RemoveEvent<UserEntity>) {
        console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
    }

}
