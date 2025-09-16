


export const apiSumary={
    register:"/api/auth/register",
    forgot_password:"/api/auth/forgot-password",
    verify_otp:"/api/auth/verify-otp",
    reset_password:'/api/auth/reset-password',
    login:'/api/auth/login',


    //DASHBOARD ROUTES

    get_user_emails:"/api/dashboard/emails/get-all-user-emails",
    update_email:"/api/dashboard/emails/update-email",
    delete_email:"/api/dashboard/emails/delete",

    create_campaign:"/api/dashboard/outbounds/add",
    get_user_outbounds:"/api/dashboard/outbounds/get-all-user-outbounds",
    update_outbound:"/api/dashboard/outbounds/update",
    delete_outbound:"/api/dashboard/outbounds/delete",
    add_new_task:"/api/dashboard/outbounds/tasks/add",
    // get_outbound_tasks: `${process.env.NEXT_PUBLIC_TASKS_SCHEDULER_WORKER}/get-outbound-tasks`,
    get_outbound_tasks: `http://localhost:4000/get-outbound-tasks`,
    get_outbound_tasks_backend:"/api/dashboard/outbounds/tasks/get-outbound-tasks",
    get_outbound_replies: "/api/dashboard/outbounds/replies/get-outbound-replies",
    send_reply:"/api/dashboard/outbounds/replies/send-reply",
    delete_campaign_member:"/api/dashboard/outbounds/replies/delete-campaign-member"
    
    

}