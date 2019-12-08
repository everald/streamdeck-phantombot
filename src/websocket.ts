import { QueueingSubject } from 'queueing-subject';
import { Subscription, Observable } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import makeWebSocketObservable, {
  GetWebSocketResponses,
  normalClosureMessage,
} from 'rxjs-websockets';

export class CommandHandler {
    authToken = '';
    serverUrl = '';

    private input$: QueueingSubject<string>;
    private messagesSubscription: Subscription;
    constructor(serverUrl: string, authToken: string) {
        // this subject queues as necessary to ensure every message is delivered
        this.input$ = new QueueingSubject<string>();
        // authenticate as soon as we connect
        this.input$.next(JSON.stringify({authenticate: authToken}));


        // create the websocket observable, does *not* open the websocket connection
        const socket$ = makeWebSocketObservable<string>(serverUrl);

        const messages$: Observable<string> = socket$.pipe(
            // the observable produces a value once the websocket has been opened
            switchMap((getResponses: GetWebSocketResponses<string>) => {
                console.log('websocket opened');
                return getResponses(this.input$);
            }),
            share()
        );

        this.messagesSubscription = messages$.subscribe(
        (message: string) => {
            console.log('received message:', message);
        },
        (error: Error) => {
            const { message } = error;
            if (message === normalClosureMessage) {
            console.log('server closed the websocket connection normally');
            } else {
            console.log('socket was disconnected due to error:', message);
            }
        },
        () => {
            // The clean termination only happens in response to the last
            // subscription to the observable being unsubscribed, any
            // other closure is considered an error.
            console.log('the connection was closed in response to the user');
        }
        );
    }

    triggerCommand(commandName: string) {
        this.input$.next(JSON.stringify({command: commandName}));
    }

    closeWebsocket() {
        this.messagesSubscription.unsubscribe();
      }
}
