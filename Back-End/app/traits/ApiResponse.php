<?php 
namespace App\Traits;
    trait ApiResponse{
        public function JsonResponse($status=200,$message=null,$data=null)
        {
            $response=[
                'status'=>$status,
                'message'=>$message,
                'data'=>$data
            ];
            return response()->json($response,$status);
        }
    }